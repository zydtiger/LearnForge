import { RawNodeDatum } from "react-d3-tree";

const mock: RawNodeDatum = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
            },
            {
              name: 'Worker',
            },
            {
              name: 'Worker',
            },
            {
              name: 'Manager',
              attributes: {
                department: 'Production',
              },
              children: [
                {
                  name: 'Foreman',
                  attributes: {
                    department: 'Fabrication',
                  },
                  children: [
                    {
                      name: 'Worker',
                    },
                    {
                      name: 'Worker',
                    },
                    {
                      name: 'Worker',
                    },
                  ],
                },
                {
                  name: 'Foreman',
                  attributes: {
                    department: 'Assembly',
                  },
                  children: [
                    {
                      name: 'Worker',
                    },
                    {
                      name: 'Worker',
                    },
                    {
                      name: 'Manager',
                      attributes: {
                        department: 'Production',
                      },
                      children: [
                        {
                          name: 'Foreman',
                          attributes: {
                            department: 'Fabrication',
                          },
                          children: [
                            {
                              name: 'Worker',
                            },
                            {
                              name: 'Worker',
                            },
                            {
                              name: 'Worker',
                            },
                          ],
                        },
                        {
                          name: 'Foreman',
                          attributes: {
                            department: 'Assembly',
                          },
                          children: [
                            {
                              name: 'Worker',
                            },
                            {
                              name: 'Worker',
                            },
                          ],
                        },
                        {
                          name: 'Manager',
                          attributes: {
                            department: 'Production',
                          },
                          children: [
                            {
                              name: 'Foreman',
                              attributes: {
                                department: 'Fabrication',
                              },
                              children: [
                                {
                                  name: 'Worker',
                                },
                                {
                                  name: 'Worker',
                                },
                                {
                                  name: 'Worker',
                                },
                              ],
                            },
                            {
                              name: 'Foreman',
                              attributes: {
                                department: 'Assembly',
                              },
                              children: [
                                {
                                  name: 'Worker',
                                },
                                {
                                  name: 'Worker',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Worker',
            },
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
}

export default mock;